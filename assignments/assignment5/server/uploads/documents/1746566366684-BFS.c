/* TO COMPILE:  gcc -Wall -ansi -o prog BFS.c */
/* TO RUN, ENTER: ./prog */


#include <stdio.h>
#include <stdlib.h>
#include <assert.h>
#include <time.h>

#define NodeValType int
#define LnkValType struct Node

struct Tree { 
  struct Node *root; 
  int size; 
};

struct Node {
  NodeValType val;
  struct Node *left;
  struct Node *right;
};

struct dLink {
   LnkValType val;
   struct dLink *next;
   struct dLink *prev;
};

struct Queue {
   struct dLink *head;
   struct dLink *tail;
};

/*----------------------------------------------*/
/*Interface of a queue implemented as a doubly linked list*/
void initQueue (struct Queue *q);
void addQueue (struct Queue *q, LnkValType val);
void removeQueue (struct Queue *q);


/*----------------------------------------------*/
/*Interface of a BST*/
void initTree(struct Tree *tree);
void addTree(struct Tree *tree, NodeValType val);
struct Node* addNode(struct Node *node, NodeValType val);
void breadthFirst(struct Tree *tree);  


/*----------------------------------------------*/
int main(){
  struct Tree tree;
  initTree(&tree);
  addTree(&tree, 32);
  addTree(&tree, 19);
  addTree(&tree, 9);
  addTree(&tree, 14);
  addTree(&tree, 8);
  addTree(&tree, 4);
  addTree(&tree, 13);
  addTree(&tree, 59);
  addTree(&tree, 99);
  addTree(&tree, 69);
  addTree(&tree, 72);
  printf("Printing nodes in the breadth-first order:\n");
  breadthFirst(&tree);
  printf("\n");
  return 0;
}


/*----------------------------------------------*/
/*Initialize a queue implemented as a doubly linked list*/
void initQueue (struct Queue *q) {
   assert(q);
   q->head = (struct dLink *) malloc(sizeof(struct dLink));
   assert(q->head != 0);
   q->tail = (struct dLink *) malloc(sizeof(struct dLink));
   assert(q->tail);
   q->head->next = q->tail;
   q->tail->prev = q->head;
}


/*----------------------------------------------*/
/*Add val to a queue implemented as a doubly linked list*/
/*input:
    q -- pointer to Queue
    val -- value to be added to Queue
*/
void addQueue (struct Queue*q, LnkValType val){ 
   assert(q);

   /*add at the tail of the queue*/
   struct dLink * lnk = q->tail;

   /*allocate and assign value to a new link*/
   struct dLink * new = (struct dLink *) malloc(sizeof(struct dLink));
   assert(new != 0);
   new->val = val;

   /*connect the new link to queue*/
   new->prev = lnk->prev;
   new->next = lnk;
   lnk->prev->next = new;
   lnk->prev = new;
}

/*----------------------------------------------*/
/*Remove the head element from a queue implemented as a doubly linked list*/
/*input: q -- pointer to Queue */
void removeQueue(struct Queue *q){
   assert(q);
   /*remove from the head of the queue*/
   struct dLink *lnk = q->head->next;
   if(q->head->next != q->tail)
   {/* q is not empty*/
       q->head->next = lnk->next;
       lnk->next->prev = q->head;
       free(lnk);
  }
}


/*----------------------------------------------*/
/* Initialize a BST */
void initTree(struct Tree *tree){
   assert(tree);
   tree->root = NULL;
   tree->size = 0;
}

/*----------------------------------------------*/
/* Recursively add a new value to a BST at the leaf level. 
Input: tree -- pointer to the BST
       val -- new value to be added to the BST
*/
void addTree(struct Tree *tree, NodeValType val) {
  assert(tree);
  /* call the recursive function for traversing the tree */
  tree->root = addNode(tree->root, val);
  tree->size++;
}

/*----------------------------------------------*/
/* Recursively add of a new value below a given node in the BST. 
Input: node -- pointer to a node in the BST
       val -- new value to be added to the BST
Output: node -- pointer to a node in the BST
*/
struct Node *addNode(struct Node * node, NodeValType val){
   /* The new value is always added as a leaf node */
   if (node == NULL)
   {  /* The traversal reached a leaf, so we must stop moving 
         down the tree. Make a new node, and return this new node
         to recursively link it to the parent nodes bottom-up. 
      */ 
      struct Node * new = (struct Node *) malloc(sizeof(struct Node));
      assert(new); 
      new->val = val; 
      new->left = new->right = NULL; 
      return new; 
   }
   else
   {  /* Recursively go to the left subtree of the current node 
         if the new value is smaller than the current node; 
         otherwise, go to the right subtree. 
      */
         if (val < node->val) 
            node->left = addNode(node->left, val);
         else 
            node->right = addNode(node->right, val);
   }
   return node;
}


void breadthFirst(struct Tree *tree){
   assert(tree);
 

/* FIX ME */
}
